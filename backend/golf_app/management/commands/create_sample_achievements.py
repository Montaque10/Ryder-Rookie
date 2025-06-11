from django.core.management.base import BaseCommand
from golf_app.models import Achievement

class Command(BaseCommand):
    help = 'Creates sample achievements for testing'

    def handle(self, *args, **kwargs):
        achievements = [
            {
                'name': 'First Round Complete',
                'description': 'Complete your first round of golf',
                'criteria_json': {'type': 'total_rounds', 'value': 1},
                'image_url': 'https://example.com/achievements/first-round.png',
            },
            {
                'name': 'Breaking 100',
                'description': 'Complete a round with a score under 100',
                'criteria_json': {'type': 'score_below', 'value': 100},
                'image_url': 'https://example.com/achievements/breaking-100.png',
            },
            {
                'name': 'Breaking 90',
                'description': 'Complete a round with a score under 90',
                'criteria_json': {'type': 'score_below', 'value': 90},
                'image_url': 'https://example.com/achievements/breaking-90.png',
            },
            {
                'name': 'Breaking 80',
                'description': 'Complete a round with a score under 80',
                'criteria_json': {'type': 'score_below', 'value': 80},
                'image_url': 'https://example.com/achievements/breaking-80.png',
            },
            {
                'name': 'Fairway Finder',
                'description': 'Hit 10 fairways in a single round',
                'criteria_json': {'type': 'fairways_hit', 'value': 10},
                'image_url': 'https://example.com/achievements/fairway-finder.png',
            },
            {
                'name': 'Putting Pro',
                'description': 'Complete a round with 30 or fewer putts',
                'criteria_json': {'type': 'putts_below', 'value': 30},
                'image_url': 'https://example.com/achievements/putting-pro.png',
            },
            {
                'name': 'Sand Save Master',
                'description': 'Successfully get up and down from a bunker',
                'criteria_json': {'type': 'sand_saves', 'value': 1},
                'image_url': 'https://example.com/achievements/sand-save.png',
            },
            {
                'name': 'Course Regular',
                'description': 'Complete 10 rounds of golf',
                'criteria_json': {'type': 'total_rounds', 'value': 10},
                'image_url': 'https://example.com/achievements/course-regular.png',
            },
            {
                'name': 'Golf Enthusiast',
                'description': 'Complete 50 rounds of golf',
                'criteria_json': {'type': 'total_rounds', 'value': 50},
                'image_url': 'https://example.com/achievements/golf-enthusiast.png',
            },
            {
                'name': 'Golf Master',
                'description': 'Complete 100 rounds of golf',
                'criteria_json': {'type': 'total_rounds', 'value': 100},
                'image_url': 'https://example.com/achievements/golf-master.png',
            },
        ]

        for achievement_data in achievements:
            Achievement.objects.get_or_create(
                name=achievement_data['name'],
                defaults=achievement_data
            )

        self.stdout.write(self.style.SUCCESS('Successfully created sample achievements')) 