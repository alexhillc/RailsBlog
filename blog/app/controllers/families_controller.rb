class FamiliesController < ApplicationController

  def create
    if current_user
      scenario = Scenario.new(title: "N/A", description: "N/A")
      family = Family.new(family_params)
      family.scenarios << scenario
      if family.save
        redirect_to fmaps_options_path
        flash[:notice] = "Successfully created family."
      else
        render 'new'
        flash[:alert] = "There was a problem creating this family."
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
        redirect_to families_path
        flash[:alert] = "You are not permitted to edit this family."  
      end
    else
      redirect_to "/log-in"
    end
  end

  def update
    if current_user
      @family = Family.find(params[:id])
      if current_user.id == @family.user_id
        if @family.update(family_params)
          redirect_to families_path
          flash[:notice] = "Successfully updated family."
        else
          render 'edit'
          flash[:alert] = "There was a problem updating this family."
        end
      else
        redirect_to families_path
        flash[:alert] = "You are not permitted to update this family."
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
        redirect_to families_path
        flash[:notice] = "Successfully deleted family."
      else
        redirect_to families_path
        flash[:alert] = "You are not permitted to delete this family."
      end
    else
      redirect_to "/log-in"
    end
  end

private
  def family_params
    params.require(:family).permit(:name, :user_id)
  end

end
