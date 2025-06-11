from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    is_pro = models.BooleanField(default=False)
    PREFERRED_HANDEDNESS_CHOICES = [
        ('R', 'Right'),
        ('L', 'Left'),
    ]
    preferred_handedness = models.CharField(
        max_length=1,
        choices=PREFERRED_HANDEDNESS_CHOICES,
        blank=True,
        null=True
    )
    handicap = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True, default=0.0)
    bio = models.TextField(blank=True, null=True, max_length=500)
    preferred_region = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.username

class Club(models.Model):
    CLUB_TYPES = [
        ('Driver', 'Driver'),
        ('Wood', 'Wood'),
        ('Hybrid', 'Hybrid'),
        ('Iron', 'Iron'),
        ('Wedge', 'Wedge'),
        ('Putter', 'Putter'),
        ('Other', 'Other'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clubs')
    club_type = models.CharField(max_length=50, choices=CLUB_TYPES)
    average_distance_yards = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s {self.club_type} ({self.average_distance_yards} yards)"

class Course(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    number_of_holes = models.IntegerField(default=18)
    par = models.IntegerField(null=True, blank=True) # Total par for the course

    def __str__(self):
        return self.name

class Hole(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='holes')
    hole_number = models.PositiveIntegerField()
    par = models.PositiveIntegerField()
    yardage = models.PositiveIntegerField(blank=True, null=True)
    handicap_index = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        unique_together = ('course', 'hole_number')
        ordering = ['hole_number']

    def __str__(self):
        return f"{self.course.name} - Hole {self.hole_number} (Par {self.par})"

class Round(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rounds')
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name='rounds')
    date = models.DateField(auto_now_add=True)
    total_score = models.IntegerField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    shareable_link = models.UUIDField(unique=True, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s round at {self.course.name if self.course else 'Unknown Course'} on {self.date}"

class HoleScore(models.Model):
    round = models.ForeignKey(Round, on_delete=models.CASCADE, related_name='hole_scores')
    hole_number = models.IntegerField()
    score = models.IntegerField()
    putts = models.IntegerField(null=True, blank=True)
    fairway_hit = models.BooleanField(default=False)
    sand_save = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('round', 'hole_number')
        ordering = ['hole_number']

    def __str__(self):
        return f"Round {self.round.id} - Hole {self.hole_number}: {self.score}"

class PracticeTip(models.Model):
    CATEGORY_CHOICES = [
        ('DRIVING', 'Driving'),
        ('PUTTING', 'Putting'),
        ('CHIPPING', 'Chipping'),
        ('IRON_PLAY', 'Iron Play'),
        ('COURSE_MANAGEMENT', 'Course Management'),
    ]

    DIFFICULTY_CHOICES = [
        (1, 'Beginner'),
        (2, 'Beginner-Intermediate'),
        (3, 'Intermediate'),
        (4, 'Intermediate-Advanced'),
        (5, 'Advanced'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    youtube_link = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    difficulty_level = models.IntegerField(choices=DIFFICULTY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"

class DrivingRange(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.city}"

class Achievement(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    criteria_json = models.JSONField(blank=True, null=True)  # Store criteria as JSON, e.g., {"min_rounds": 5, "avg_score_below": 90}
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='user_achievements')
    date_achieved = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'achievement')
        ordering = ['-date_achieved']

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"

class Friendship(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendships')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'friend')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} and {self.friend.username} are friends"

    def save(self, *args, **kwargs):
        # Ensure we don't create duplicate friendships
        if not Friendship.objects.filter(user=self.user, friend=self.friend).exists():
            super().save(*args, **kwargs)
            # Create the reverse friendship if it doesn't exist
            if not Friendship.objects.filter(user=self.friend, friend=self.user).exists():
                Friendship.objects.create(user=self.friend, friend=self.user) 