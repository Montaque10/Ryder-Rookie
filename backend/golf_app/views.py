from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Sum, Q, Avg, Count
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.shortcuts import get_object_or_404

import requests
import os
import uuid

from .models import Club, Course, Round, HoleScore, DrivingRange, Achievement, PracticeTip, UserAchievement, Friendship
from .serializers import (
    UserSerializer, ClubSerializer, CourseSerializer, RoundSerializer, 
    HoleScoreSerializer, DrivingRangeSerializer, AchievementSerializer, PracticeTipSerializer,
    UserAchievementSerializer, RoundShareSerializer, FriendshipSerializer
)

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only view/edit their own profile
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def search_users(self, request):
        search_term = request.query_params.get('search_term', '')
        if not search_term:
            return Response({'error': 'search_term is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        users = User.objects.filter(
            username__icontains=search_term
        ).exclude(
            id=request.user.id
        )[:10]  # Limit to 10 results
        
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class ClubViewSet(viewsets.ModelViewSet):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Clubs are specific to the logged-in user
        return self.request.user.clubs.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WeatherView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        city = request.query_params.get('city')
        country_code = request.query_params.get('country_code')
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')

        if not city and not (lat and lon):
            return Response(
                {'error': 'Either city or lat/lon coordinates are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Construct the API URL
            base_url = 'http://api.openweathermap.org/data/2.5/weather'
            params = {
                'appid': settings.OPENWEATHER_API_KEY,
                'units': 'metric'  # Use metric units (Celsius)
            }

            if lat and lon:
                params.update({'lat': lat, 'lon': lon})
            else:
                params.update({'q': f"{city},{country_code}" if country_code else city})

            # Make the API request
            response = requests.get(base_url, params=params)
            response.raise_for_status()  # Raise an exception for bad status codes
            data = response.json()

            # Extract and format the weather data
            weather_data = {
                'temperature': round(data['main']['temp']),
                'feels_like': round(data['main']['feels_like']),
                'description': data['weather'][0]['description'],
                'icon_code': data['weather'][0]['icon'],
                'city_name': data['name'],
                'country_code': data['sys']['country'],
                'humidity': data['main']['humidity'],
                'wind_speed': data['wind']['speed'],
                'clouds': data['clouds']['all']
            }

            return Response(weather_data)

        except requests.exceptions.RequestException as e:
            return Response(
                {'error': f'Weather API error: {str(e)}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except (KeyError, ValueError) as e:
            return Response(
                {'error': f'Invalid response from weather API: {str(e)}'},
                status=status.HTTP_502_BAD_GATEWAY
            )

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Course.objects.all()
        search_term = self.request.query_params.get('search', '')
        city = self.request.query_params.get('city', '')
        name = self.request.query_params.get('name', '')

        if search_term:
            queryset = queryset.filter(
                Q(name__icontains=search_term) |
                Q(city__icontains=search_term) |
                Q(address__icontains=search_term)
            )
        if city:
            queryset = queryset.filter(city__icontains=city)
        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def course_search_and_weather(self, request):
        search_term = request.query_params.get('search', '')
        if not search_term:
            return Response(
                {'error': 'Search term is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Search for courses
        courses = Course.objects.filter(
            Q(name__icontains=search_term) |
            Q(city__icontains=search_term) |
            Q(address__icontains=search_term)
        )[:5]

        # Get weather for each course's city
        results = []
        for course in courses:
            try:
                weather_response = requests.get(
                    'http://api.openweathermap.org/data/2.5/weather',
                    params={
                        'q': f"{course.city},US",
                        'appid': settings.OPENWEATHER_API_KEY,
                        'units': 'metric'
                    }
                )
                weather_data = weather_response.json()
                
                results.append({
                    'course': CourseSerializer(course).data,
                    'weather': {
                        'temperature': round(weather_data['main']['temp']),
                        'description': weather_data['weather'][0]['description'],
                        'icon': weather_data['weather'][0]['icon']
                    }
                })
            except Exception as e:
                results.append({
                    'course': CourseSerializer(course).data,
                    'weather': {'error': str(e)}
                })

        return Response(results)

class RoundViewSet(viewsets.ModelViewSet):
    queryset = Round.objects.all()
    serializer_class = RoundSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.rounds.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def calculate_total_score(self, request, pk=None):
        round = self.get_object()
        total_score = round.hole_scores.aggregate(Sum('score'))['score__sum']
        round.total_score = total_score
        round.save()
        return Response({'total_score': total_score}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def leaderboard(self, request):
        # Leaderboard for total scores in the last 7 days
        start_date = timezone.now() - timedelta(days=7)
        leaderboard_data = User.objects.filter(
            rounds__created_at__gte=start_date,
            rounds__is_completed=True
        ).annotate(
            total_score=Sum('rounds__total_score')
        ).filter(
            total_score__isnull=False
        ).order_by('total_score')[:10]

        return Response([{
            'rank': idx + 1,
            'username': user.username,
            'total_score': user.total_score
        } for idx, user in enumerate(leaderboard_data)])

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def suggest_club(self, request):
        # Get user's recent rounds and scores
        recent_rounds = Round.objects.filter(
            user=request.user,
            is_completed=True
        ).order_by('-created_at')[:5]

        if not recent_rounds:
            return Response(
                {'error': 'No recent rounds found for analysis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Analyze scores and suggest clubs
        suggestions = []
        for round in recent_rounds:
            hole_scores = round.hole_scores.all()
            for hole_score in hole_scores:
                if hole_score.score > hole_score.round.course.holes.get(hole_number=hole_score.hole_number).par + 2:
                    suggestions.append({
                        'hole_number': hole_score.hole_number,
                        'score': hole_score.score,
                        'par': hole_score.round.course.holes.get(hole_number=hole_score.hole_number).par,
                        'suggestion': 'Consider using a different club or practicing this hole'
                    })

        if not suggestions:
            return Response({
                'message': 'No specific club suggestions based on recent performance'
            })

        return Response(suggestions)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def share_round(self, request, pk=None):
        round_instance = self.get_object()
        if not round_instance.shareable_link:
            round_instance.shareable_link = uuid.uuid4()
            round_instance.save()
        return Response({'shareable_link': round_instance.shareable_link})

class HoleScoreViewSet(viewsets.ModelViewSet):
    queryset = HoleScore.objects.all()
    serializer_class = HoleScoreSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Hole scores are related to a specific round of the current user
        return HoleScore.objects.filter(
            round__user=self.request.user
        ).select_related('round', 'round__course')

    def perform_create(self, serializer):
        # Ensure the round belongs to the current user
        round_id = serializer.validated_data['round'].id
        round = get_object_or_404(Round, id=round_id, user=self.request.user)
        
        # Validate hole number exists in the course
        hole_number = serializer.validated_data['hole_number']
        if not round.course.holes.filter(hole_number=hole_number).exists():
            raise serializers.ValidationError(
                f'Hole number {hole_number} does not exist in this course'
            )
        
        serializer.save()

    def perform_update(self, serializer):
        # Ensure the hole score belongs to the current user
        hole_score = self.get_object()
        if hole_score.round.user != self.request.user:
            raise permissions.PermissionDenied(
                "You don't have permission to update this hole score"
            )
        serializer.save()

class PracticeTipViewSet(viewsets.ModelViewSet):
    queryset = PracticeTip.objects.all()
    serializer_class = PracticeTipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PracticeTip.objects.all()

    @action(detail=False, methods=['get'])
    def practice_tips(self, request):
        tips = self.get_queryset()
        serializer = self.get_serializer(tips, many=True)
        return Response(serializer.data)

class DrivingRangeViewSet(viewsets.ModelViewSet):
    queryset = DrivingRange.objects.all()
    serializer_class = DrivingRangeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DrivingRange.objects.all()

class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def achievements(self, request):
        achievements = self.get_queryset()
        serializer = self.get_serializer(achievements, many=True)
        return Response(serializer.data)

class UserAchievementViewSet(viewsets.ModelViewSet):
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        metric = request.query_params.get('metric', 'average_score')
        
        if metric == 'average_score':
            leaderboard = User.objects.annotate(
                avg_score=Avg('rounds__total_score')
            ).filter(
                avg_score__isnull=False
            ).order_by('avg_score')[:10]
            
            return Response([{
                'rank': idx + 1,
                'username': user.username,
                'average_score': round(user.avg_score, 2)
            } for idx, user in enumerate(leaderboard)])
            
        elif metric == 'total_rounds':
            leaderboard = User.objects.annotate(
                total_rounds=Count('rounds')
            ).filter(
                total_rounds__gt=0
            ).order_by('-total_rounds')[:10]
            
            return Response([{
                'rank': idx + 1,
                'username': user.username,
                'total_rounds': user.total_rounds
            } for idx, user in enumerate(leaderboard)])
            
        return Response(
            {'error': 'Invalid metric specified'},
            status=status.HTTP_400_BAD_REQUEST
        )

class SharedRoundView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, shareable_link):
        round_instance = get_object_or_404(Round, shareable_link=shareable_link)
        serializer = RoundShareSerializer(round_instance)
        return Response(serializer.data)

class FriendshipViewSet(viewsets.ModelViewSet):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Friendship.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        friend_id = self.request.data.get('friend')
        if not friend_id:
            raise serializers.ValidationError({'friend': 'This field is required.'})
        
        if int(friend_id) == self.request.user.id:
            raise serializers.ValidationError({'friend': 'You cannot add yourself as a friend.'})
        
        friend = get_object_or_404(User, id=friend_id)
        serializer.save(user=self.request.user, friend=friend)

    @action(detail=False, methods=['delete'], permission_classes=[IsAuthenticated])
    def remove_friend(self, request):
        friend_id = request.data.get('friend_id')
        if not friend_id:
            return Response({'error': 'friend_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        Friendship.objects.filter(
            user=request.user,
            friend_id=friend_id
        ).delete()
        
        Friendship.objects.filter(
            user_id=friend_id,
            friend=request.user
        ).delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT) 