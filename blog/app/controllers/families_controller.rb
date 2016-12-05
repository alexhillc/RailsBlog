class FamiliesController < ApplicationController

  def create
    if current_user
      if User.authenticate(current_user.email, family_params[:password])
        scenario = Scenario.new(title: "N/A", description: "N/A")
        family = Family.new(family_params)
        family.scenarios << scenario
        if family.save
          flash[:notice] = "Successfully created family."
          redirect_to families_path
        else
          flash[:alert] = "There was a problem creating this family."
          render 'new'
        end
      else
        flash[:alert] = "Incorrect password entered."
        render 'new'
      end
    else
      redirect_to "/log-in"
    end
  end

  def new
    if !current_user
      redirect_to "/log-in"
    end
  end

  def index
    if current_user
      @families = Family.where(:user_id => current_user.id)
    else
      redirect_to "/log-in"
    end
  end

  def edit
    if current_user
      @family = Family.find(params[:id])
      if current_user.id != @family.user_id
        flash[:alert] = "You are not permitted to edit this family."
        redirect_to families_path
      end
    else
      redirect_to "/log-in"
    end
  end

  def update
    if current_user
      @family = Family.find(params[:id])
      if User.authenticate(current_user.email, family_params[:password])
        if current_user.id == @family.user_id
          if @family.update(family_params)
            flash[:notice] = "Successfully updated family."
            redirect_to families_path
          else
            flash[:alert] = "There was a problem updating this family."
            render 'edit'
          end
        else
          flash[:alert] = "You are not permitted to update this family."
          redirect_to families_path
        end
      else
        flash[:alert] = "Incorrect password entered."
        render 'edit'
      end
    else
      redirect_to "/log-in"
    end
  end

  def destroy
    if current_user
      @family = Family.find(params[:id])
      if current_user.id == @family.user_id
        @family.destroy
        flash[:notice] = "Successfully deleted family."
        redirect_to families_path
      else
        flash[:alert] = "You are not permitted to delete this family."
        redirect_to families_path
      end
    else
      redirect_to "/log-in"
    end
  end

private
  def family_params
    params.require(:family).permit(:encrypted_name, :user_id, :password)
  end

end
