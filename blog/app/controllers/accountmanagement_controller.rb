class AccountmanagementController < ApplicationController
	def index
	end

	def updatepassword
	end

	def update
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
