class AccountmanagementController < ApplicationController

	def index
	end
        
        def accounts
          if current_user.try(:admin?)
            @users = User.all
          else
            flash[:alert] = "You are not an administrator!"
            redirect_to accountmanagement_path
          end
        end

	def createaccount
		if !current_user.try(:admin?)
			flash[:alert] = "You are not an administrator!"
			redirect_to accountmanagement_path
		end
	end

	def updatepassword
		if !current_user
			redirect_to "/log-in"
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
		newUser = User.new(user_params)
		if newUser.save!
			flash[:notice] = "Account successfully created."
                        render 'createaccount'
		else
			flash[:alert] = "There was an error creating the account."
			render 'createaccount'
		end
	end
        
        def freeze
          if current_user.try(:admin?)
            user = User.find(params[:id])
            if user.update_attribute(:account_frozen, true)
              redirect_to accountmanagement_accounts_path
              flash[:notice] = "Account successfully frozen."
            else
              redirect_to accountmanagement_accounts_path
              flash[:alert] = "There was an issue freezing the account."
            end
          else
            redirect_to accountmangement_accounts_path
            flash[:alert] = "You are not an administrator!"
          end
        end

        def unfreeze
          if current_user.try(:admin?)
            user = User.find(params[:id])
            if user.update_attribute(:account_frozen, false)
              redirect_to accountmanagement_accounts_path
              flash[:notice] = "Account successfully unfrozen."
            else
              redirect_to accountmanagement_accounts_path
              flash[:alert] = "There was an issue unfreezing the account."
            end
          else
            redirect_to accountmanagement_accounts_path
            flash[:alert] = "You are not an administrator!"
          end
        end

        def destroy
          if current_user.try(:admin?)
            user = User.find(params[:id])
            if user.destroy
              redirect_to accountmanagement_accounts_path
              flash[:notice] = "Account successfully deleted."
            else
              redirect_to accountmanagement_accounts_path
              flash[:alert] = "There was an issue deleting the account."
            end
          else
            redirect_to accountmanagement_accounts_path
            flash[:alert] = "You are not an administrator!"
          end
        end

	def user_params
		params.require(:user).permit(:email, :password, :password_confirmation)
	end

end
