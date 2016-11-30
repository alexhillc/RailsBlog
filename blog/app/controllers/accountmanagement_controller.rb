class AccountmanagementController < ApplicationController

	def index
	end

	def createaccount
		if !current_user.try(:admin?)
			flash[:notice] = "You are not an administrator!"
			redirect_to "/"
		end
	end

	def updatepassword
		if !current_user
			redirect_to "/"
		end
	end

	def update
		# Only update the password when the password they entered as current
		# is correct
		if current_user && User.authenticate(current_user.email, params[:password])
			if params[:newpassword] == params[:newpassword2]
				current_user.password = params[:newpassword]
				if current_user.save!
					flash[:notice] = "You have successfully changed your password!"
				end
			else
				flash[:alert] = "Passwords did not match!"
			end
		else
			flash[:alert] = "Incorrect current password!"
		end
		redirect_to :back
	end
	
	def create
                family = Family.new(encrypted_name: "N/A")
		newUser = User.new(user_params)
                newUser.families << family
		if newUser.save
			flash[:notice] = "Account created!"
                        render 'createaccount'
		else
			flash[:alert] = "There was an error creating the account."
			render 'createaccount'
		end
	end

	def user_params
		params.require(:user).permit(:email, :password, :password_confirmation)
	end

end
