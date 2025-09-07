# MERN_AUTH_BACKEND_V2

AUTHENTICATION APPLICATION

# Registration Part

1. first make a schema, route, middleware etc.
2. upload image on cloudinary.
3. validate phone number using regex.
4. validate if user already exist and set a limit to how many time user can attepmt to register.
5. sent an otp verification code using email ( nodemailer) or phoneNumber (twilio) and save it into db.
6. save user info into database.
7. Registration done!!!!!!!!!!!

# OTP VERIFICATION

1. find latest user using sort({createdAt: -1}), it will give me latest register. 
