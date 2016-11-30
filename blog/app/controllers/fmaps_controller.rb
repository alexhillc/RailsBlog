class FmapsController < ApplicationController

def options
    if !current_user
        redirect_to "/log-in"
    end
end

def index
    if current_user
        @families = Family.where(:user_id => current_user.id)
        if @families.first
          @scenarios = Scenario.where(:family_id => @families.first.id)
          if @scenarios.first
            @fmaps = Fmap.where(:scenario_id => @scenarios.first.id)
          end
        end
    else
        redirect_to "/log-in"
    end
end

def show
	if current_user
		@fmap = Fmap.find(params[:id])
		@zmap = Fmap.new
                @scenarios = Scenario.where(:id => @fmap.scenario_id)
                @families = Family.where(:id => @scenarios.first.family_id)
		if current_user.id == @families.first.user_id
			gon.id = @fmap
		else
			redirect_to "/fmaps"
		end
	else
		redirect_to "/log-in"
	end
end

def about
end

def new
	if current_user
		@fmap = Fmap.new
		@zmap = Fmap.new
                @families = Family.where(:user_id => current_user.id)
                @scenarios = Scenario.where(:family_id => @families.first.id)
	else
		redirect_to "/log-in"
	end
end

def create
	if current_user
		@fmap = Fmap.new(fmap_params)
		if @fmap.save
			redirect_to @fmap
		else
			render 'new'
		end
	else
		redirect_to "/log-in"
	end
end

def update
	if current_user
		@fmap = Fmap.find(params[:id])
		if @fmap.update(fmap_params)
			redirect_to @fmap
		else
			render 'edit'
		end
	else
		redirect_to "/log-in"
	end
end

def destroy
	if current_user
                @scenario = Scenario.find(params[:scenario])
                @family = Family.find(@scenario.family)
                @user = User.find(@family.belongs_to_user)
		if current_user.id == @user.id
                  @fmap = Fmap.find(params[:id])
                  @fmap.destroy
                  redirect_to fmaps_path
		else
                  redirect_to "index"
		end
	else
		redirect_to "/log-in"
	end
end

def valid_fmaps
  if current_user
     @fmaps = Fmap.where(scenario_id: params["scenario_id"])

     respond_to do |format|
        format.js
     end
  else
     redirect_to "/"
  end
end

private
  def fmap_params
    params.require(:fmap).permit(:title, :version, :json, :scenario, :notes, :extra, :scenario_id)
  end

end
