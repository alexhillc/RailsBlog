class ScenariosController < ApplicationController

  def new
    if !current_user
      redirect_to "/log-in"
    end
  end
  
  def index
    if current_user
        @families = Family.where(:user_id => current_user.id)
        @scenarios = Scenario.where(:family_id => @families.first.id)
    else
        redirect_to "/log-in"
    end
  end
  
  def edit
    if current_user
      @scenario = Scenario.find(params[:id])
      @family = Family.find(@scenario.family_id)
      if current_user.id != @family.user_id
        redirect_to scenarios_path
        flash[:alert] = "You are not permitted to edit this scenario."
      end
    else
      redirect_to "/log-in"
    end
  end

  def create
    if current_user
      scenario = Scenario.new(scenario_params)
      if scenario.save
        redirect_to scenarios_path
        flash[:notice] = "Successfully created scenario."
      else 
        render 'new'
        flash[:alert] = "There was a problem creating this scenario."
      end
    else
      redirect_to "/log-in"
    end
  end

  def update
    if current_user
      @scenario = Scenario.find(params[:id])
      @family = Family.find(@scenario.family_id)
      if current_user.id == @family.user_id
        if @scenario.update(scenario_params)
          redirect_to scenarios_path
          flash[:notice] = "Successfully updated scenario."
        else
          render 'edit'
          flash[:alert] = "There was a problem updating this scenario."
        end
      else
        redirect_to scenarios_path
        flash[:alert] = "You are not permitted to update this scenario."
      end
    else
      redirect_to "/log-in"
    end
  end

  def destroy
    if current_user
      @scenario = Scenario.find(params[:id])
      @family = Family.find(@scenario.family_id)
      if current_user.id == @family.user_id
        @scenario.destroy
        redirect_to scenarios_path
        flash[:notice] = "Successfully deleted scenario."
      else
        redirect_to scenarios_path
        flash[:alert] = "You are not permitted to delete this scenario."
      end
    else
      redirect_to "/log-in"
    end
  end
  
  def valid_scenarios
    if current_user
      @scenarios = Scenario.where(family_id: params["family_id"])
      
      respond_to do |format|
        format.js
      end
    else
      redirect_to "/"
    end
  end

private
  def scenario_params
    params.require(:scenario).permit(:title, :description, :family_id)
  end 

end
