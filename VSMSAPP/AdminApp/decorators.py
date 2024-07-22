from django.shortcuts import redirect
from rest_framework.response import Response

def checkSuperUser(fun):
    def innerFun(request):
        if request.user.is_superuser:
            return fun(request)
        else:
            return Response("Not a super user")
    return innerFun