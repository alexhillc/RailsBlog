class FmapsController < ApplicationController

def index
	if current_user
		@fmaps = Fmap.all
	else
		redirect_to "/log-in"
	end
end

def about
end

def show
	if current_user
		@fmap = Fmap.find(params[:id])
		@zmap = Fmap.new
		if current_user.email == @fmap.username
			gon.id = @fmap
		else
			redirect_to "/fmaps"
		end
	else
		redirect_to "/log-in"
	end
end

def new
	if current_user
		@fmap = Fmap.new
		@zmap = Fmap.new
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
		@fmap = Fmap.find(params[:id])
		if current_user.email == @fmap.username
			@fmap.destroy
			redirect_to fmaps_path
		else
			redirect_to "index"
		end
	else
		redirect_to "/log-in"
	end
end

private
  def fmap_params
    params.require(:fmap).permit(:title, :username, :version, :json, :family, :notes, :extra)
  end



end
