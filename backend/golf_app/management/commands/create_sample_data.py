from django.core.management.base import BaseCommand
from golf_app.models import PracticeTip, DrivingRange

class Command(BaseCommand):
    help = 'Creates sample data for practice tips and driving ranges'

    def handle(self, *args, **kwargs):
        # Create sample practice tips
        practice_tips = [
            {
                'title': 'Perfect Your Grip',
                'description': 'Learn the proper way to hold your golf club for maximum control and power.',
                'youtube_link': 'https://www.youtube.com/watch?v=example1',
                'category': 'DRIVING',
                'difficulty_level': 1,
            },
            {
                'title': 'Master the Putt',
                'description': 'Essential putting techniques for beginners to improve accuracy and consistency.',
                'youtube_link': 'https://www.youtube.com/watch?v=example2',
                'category': 'PUTTING',
                'difficulty_level': 1,
            },
            {
                'title': 'Advanced Chipping',
                'description': 'Take your chipping game to the next level with these professional techniques.',
                'youtube_link': 'https://www.youtube.com/watch?v=example3',
                'category': 'CHIPPING',
                'difficulty_level': 4,
            },
            {
                'title': 'Iron Play Fundamentals',
                'description': 'Master the basics of iron play for consistent ball striking.',
                'youtube_link': 'https://www.youtube.com/watch?v=example4',
                'category': 'IRON_PLAY',
                'difficulty_level': 2,
            },
            {
                'title': 'Course Management Strategy',
                'description': 'Learn how to think your way around the course like a pro.',
                'youtube_link': 'https://www.youtube.com/watch?v=example5',
                'category': 'COURSE_MANAGEMENT',
                'difficulty_level': 3,
            },
        ]

        for tip_data in practice_tips:
            PracticeTip.objects.get_or_create(
                title=tip_data['title'],
                defaults=tip_data
            )

        # Create sample driving ranges
        driving_ranges = [
            {
                'name': 'Golf World Driving Range',
                'address': '123 Golf Lane',
                'city': 'New York',
                'state': 'NY',
                'latitude': 40.7128,
                'longitude': -74.0060,
                'phone_number': '(555) 123-4567',
                'website': 'https://www.golfworld.com',
            },
            {
                'name': 'Pro Golf Center',
                'address': '456 Fairway Drive',
                'city': 'Los Angeles',
                'state': 'CA',
                'latitude': 34.0522,
                'longitude': -118.2437,
                'phone_number': '(555) 987-6543',
                'website': 'https://www.progolfcenter.com',
            },
            {
                'name': 'Golf Practice Hub',
                'address': '789 Tee Street',
                'city': 'Chicago',
                'state': 'IL',
                'latitude': 41.8781,
                'longitude': -87.6298,
                'phone_number': '(555) 456-7890',
                'website': 'https://www.golfpracticehub.com',
            },
        ]

        for range_data in driving_ranges:
            DrivingRange.objects.get_or_create(
                name=range_data['name'],
                defaults=range_data
            )

        self.stdout.write(self.style.SUCCESS('Successfully created sample data')) 