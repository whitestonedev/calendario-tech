import jwt
import datetime
import os


def generate_access_token():
    """
    Generates a JSON Web Token (JWT) access token using a secret key.

    The token includes:
    - A `scope` claim to define the access scope (e.g., "calendar_api").
    - An expiration time set to 1 day from the time of generation.

    Note:
    - Ensure the `SECRET_KEY` environment variable is set for secure token generation.
    - Using a hardcoded secret key is NOT recommended for production environments.
    """

    SECRET_KEY = os.getenv("SECRET_KEY") or "my_super_secret"

    access_token = jwt.encode(
        {
            "scope": "calendar_api",  # You can set any relevant claim here
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
        },
        SECRET_KEY,
        algorithm="HS256",
    )

    return access_token


if __name__ == "__main__":
    # Generate and print the token
    token = generate_access_token()
    print(f"Generated JWT Token: {token}")
