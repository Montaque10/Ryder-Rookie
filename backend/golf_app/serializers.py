from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Club, Course, Round, HoleScore, DrivingRange, Achievement, UserAchievement, PracticeTip, Friendship

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_pro', 'preferred_handedness', 
                 'handicap', 'bio', 'preferred_region', 'profile_picture')
        read_only_fields = ('id', 'email')

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'is_pro', 'preferred_handedness',
                 'handicap', 'bio', 'preferred_region', 'profile_picture')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ('id', 'user', 'club_type', 'average_distance_yards', 'notes')
        read_only_fields = ('user',)

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name', 'address', 'city', 'state', 'latitude', 'longitude', 'number_of_holes', 'par')

class HoleScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = HoleScore
        fields = ('id', 'round', 'hole_number', 'score', 'putts', 'fairway_hit', 'sand_save')
        read_only_fields = ('round',)

class RoundSerializer(serializers.ModelSerializer):
    hole_scores = HoleScoreSerializer(many=True, read_only=True)

    class Meta:
        model = Round
        fields = ('id', 'user', 'course', 'date', 'total_score', 'hole_scores')
        read_only_fields = ('user', 'total_score', 'date')

class DrivingRangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrivingRange
        fields = ('id', 'name', 'address', 'city', 'state', 'latitude', 'longitude', 'phone_number', 'website')

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'criteria_json', 'image_url', 'created_at', 'updated_at']

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'date_achieved']

class PracticeTipSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_level_display', read_only=True)

    class Meta:
        model = PracticeTip
        fields = ['id', 'title', 'description', 'youtube_link', 'category', 
                 'category_display', 'difficulty_level', 'difficulty_display',
                 'created_at', 'updated_at']

class RoundShareSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    shareable_link = serializers.UUIDField(read_only=True)

    class Meta:
        model = Round
        fields = ['id', 'course_name', 'total_score', 'date', 'username', 'shareable_link']

class FriendshipSerializer(serializers.ModelSerializer):
    friend_username = serializers.CharField(source='friend.username', read_only=True)
    friend_profile_picture = serializers.ImageField(source='friend.profile_picture', read_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'friend_username', 'friend_profile_picture', 'created_at']
        read_only_fields = ['created_at'] 