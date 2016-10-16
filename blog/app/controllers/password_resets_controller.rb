class PasswordResetsController < ApplicationController

	def new
	end

	def create
		user = User.find_by_email(params[:email])
		user.send_password_reset
		redirect_to root_url, :notice => "Email sent with password reset instructions."
	end

	def edit
		@user = User.find_by_password_reset_token!(params[:id])
	end

	def update
		@user = User.find_by_password_reset_token!(params[:id])
		if params[:newpassword] == params[:newpassword2]
			@user.password = params[:newpassword]
			if @user.save!
				flash[:notice] = "You have successfully changed your password!"
			else
				flash[:alert] = "Couldn't update password"
			end
		else
			flash[:alert] = "Your passwords did not match"
		end
		current_user = @user
		redirect_to "/"
	end

end
