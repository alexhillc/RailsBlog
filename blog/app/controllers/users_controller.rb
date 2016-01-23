class UsersController < ApplicationController

def create
	@user = User.new(user_params)
	if @user.save
		#If user is already logged in
		flash[:notice] = "Welcome to the site!"
		redirect_to "/"
	else
		flash[:alert] = "There was a problem creating your account. Feature not ready."
		redirect_to :back
end
end


private

def user_params
params.require(:user).permit(:email, :password, :password_confirmation)
end
end
