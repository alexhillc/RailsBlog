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
          families = Family.where(:user_id => current_user.id)

          scenarios = []
          families.each do |f|
            scenarios += Scenario.where(:family_id => f.id)
          end
          
          fmaps = []
          scenarios.each do |s|
            fmaps += Fmap.where(:scenario_id => s.id)
          end
                                        
					flash[:notice] = "You have successfully changed your password! Please wait for your data to be re-encrypted. You will be redirected when finished."
          respond_to do |format|
            format.json { render :json => {:families => families,
                                           :fmaps => fmaps} }
          end
          return
				end
			else
				flash[:alert] = "Passwords did not match!"
			end
		else
			flash[:alert] = "Incorrect current password!"
		end
               
    respond_to do |format|
      format.json { render :json => {} }
    end
	end

  def updateuserdata
    # Only update user data if user is authenticated
    if current_user && User.authenticate(current_user.email, params[:password])
      json = params[:json]
      json[:families].each do |f|
        Rails.logger.debug(f[1]['encrypted_name'])
        family = Family.find(f[1]['id'])
        family.encrypted_name = f[1]['encrypted_name']
        family.save
      end

      json[:fmaps].each do |f|
        fmap = Fmap.find(f[1]['id'])
        fmap.json = f[1]['json']
        fmap.save
      end

      flash[:notice] = "Success!"
    else
      flash[:alert] = "Failure! Please contact a site administrator."
    end

    respond_to do |format|
      format.js { render js: "window.location.href = '"+accountmanagement_path+"'" }
    end
  end

	
	def create
		newUser = User.new(user_params)
		if newUser.save!
			flash[:notice] = "Account successfully created."
		else
			flash[:alert] = "There was an error creating the account."
		end
    render 'createaccount'
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
