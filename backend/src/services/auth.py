from flask import request, jsonify
import jwt
import os


SECRET_KEY = os.getenv("SECRET_KEY")


def check_credentials():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"message": "A valid token is missing!"}), 401

    if token.startswith("Bearer "):
        token = token.replace("Bearer ", "")

    try:
        jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token!"}), 401

    return None  # Auth passed
