from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ClubViewSet, CourseViewSet, RoundViewSet, HoleScoreViewSet, 
    DrivingRangeViewSet, AchievementViewSet, UserAchievementViewSet, LeaderboardView,
    WeatherView, PracticeTipViewSet, FriendshipViewSet, SharedRoundView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'clubs', ClubViewSet, basename='club')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'rounds', RoundViewSet, basename='round')
router.register(r'hole-scores', HoleScoreViewSet, basename='hole-score')
router.register(r'driving-ranges', DrivingRangeViewSet, basename='driving-range')
router.register(r'achievements', AchievementViewSet, basename='achievement')
router.register(r'user-achievements', UserAchievementViewSet, basename='user-achievement')
router.register(r'practice-tips', PracticeTipViewSet, basename='practice-tip')
router.register(r'friendships', FriendshipViewSet, basename='friendship')

urlpatterns = [
    path('', include(router.urls)),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('weather/', WeatherView.as_view(), name='weather'),
    path('shared_round/<uuid:shareable_link>/', SharedRoundView.as_view(), name='shared-round'),
] 