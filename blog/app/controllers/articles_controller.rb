class ArticlesController < ApplicationController

def new
	if current_user
		@article = Article.new
	else
		redirect_to "/log-in"
	end
end

def create
	if current_user
		@article = Article.new(article_params)
		if @article.save
			redirect_to @article
		else
			render 'new'
		end
	else
		redirect_to "/log-in"
	end
end
 
def show
	if current_user
		@article = Article.find(params[:id])
	else
		redirect_to "/log-in"
	end
end
 
def index
	if current_user
		@articles = Article.all
	else
		redirect_to "/log-in"
	end
end 

def edit
	if current_user
	@article = Article.find(params[:id])
		if current_user.email == @article.user_name
			@article = Article.find(params[:id])
		else
			redirect_to "index"
		end
	else
		redirect_to "/log-in"
	end 
end

def update
	if current_user
		@article = Article.find(params[:id])
		if @article.update(article_params)
			redirect_to @article
		else
			render 'edit'
		end
	else
		redirect_to "/log-in"
	end
end

def destroy
	if current_user
		@article = Article.find(params[:id])
		if current_user.email == @article.user_name
			@article.destroy
			redirect_to articles_path
		else
			redirect_to "index"
		end
	else
		redirect_to "/log-in"
	end
end
 
private
  def article_params
    params.require(:article).permit(:title, :text, :user_name)
  end
  

  
end
