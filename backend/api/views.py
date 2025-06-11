from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Course, Game, Hole
from .serializers import (
    UserSerializer, CourseSerializer, GameSerializer, HoleSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

class GameViewSet(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Game.objects.filter(player=self.request.user)

    @action(detail=True, methods=['post'])
    def add_hole(self, request, pk=None):
        game = self.get_object()
        serializer = HoleSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(game=game)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HoleViewSet(viewsets.ModelViewSet):
    serializer_class = HoleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Hole.objects.filter(game__player=self.request.user) 