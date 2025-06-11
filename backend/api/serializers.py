from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Game, Hole

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class HoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hole
        fields = '__all__'

class GameSerializer(serializers.ModelSerializer):
    holes = HoleSerializer(many=True, read_only=True)
    player = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        write_only=True,
        source='course'
    )

    class Meta:
        model = Game
        fields = ('id', 'player', 'course', 'course_id', 'date', 'total_score', 
                 'notes', 'holes', 'created_at', 'updated_at')
        read_only_fields = ('id', 'player', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['player'] = self.context['request'].user
        return super().create(validated_data) 