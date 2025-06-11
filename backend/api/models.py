from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    holes = models.IntegerField(default=18)
    par = models.IntegerField(default=72)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Game(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='games')
    date = models.DateField()
    total_score = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.player.username} - {self.course.name} - {self.date}"

class Hole(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='holes')
    hole_number = models.IntegerField()
    par = models.IntegerField()
    score = models.IntegerField()
    putts = models.IntegerField(default=0)
    fairway_hit = models.BooleanField(default=False)
    green_in_regulation = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ('game', 'hole_number')

    def __str__(self):
        return f"Hole {self.hole_number} - Score: {self.score}" 