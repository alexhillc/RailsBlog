class AccountmanagementController < ApplicationController
	def index
	end

	def updatepassword
	end

	def update
		# Only update the password when the password they entered as current
		# is correct
		if User.authenticate(current_user.email, params[:password])
			if params[:newpassword] == params[:newpassword2]
				current_user.password = params[:newpassword]
				current_user.save()
				flash[:notice] = "You have successfully changed your password!"
			else
				flash[:notice] = "Passwords did not match!"
			end
		else
			flash[:notice] = "Incorrect current password!"
		end
		redirect_to :back
	end
	
	def create
		@user = User.new(user_params)
		if @user.save
			flash[:notice] = "Account created!"
		else
			flash[:notice] = "There was an error creating the account."
		end
	end

	def user_params
		params.require(:user).permit(:email, :password, :password_confirmation)
	end

end
