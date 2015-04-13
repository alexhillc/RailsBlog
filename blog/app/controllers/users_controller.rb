class UsersController < ApplicationController

def create
	@user = User.new(user_params)
	if @user.save
		flash[:notice] = "Welcome to the site!"
		redirect_to "/"
	else
		flash[:alert] = "There was a problem creating your account. Your passwords did not match, your password is not 7 characters or more, or the email is already in use."
		redirect_to :back
end
end


private

def user_params
params.require(:user).permit(:email, :password, :password_confirmation)
end
end
