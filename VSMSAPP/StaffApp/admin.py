from django.contrib import admin
from .models import Courses,Batches,GalleryImages,GalleryImagesTypes

# Register your models here.

admin.site.register(Courses)
admin.site.register(Batches)
admin.site.register(GalleryImagesTypes)
admin.site.register(GalleryImages)
