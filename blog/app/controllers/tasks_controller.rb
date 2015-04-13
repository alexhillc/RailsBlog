class TasksController < ApplicationController
  before_action :all_tasks, only: [:index, :create, :update, :destroy]
  before_action :set_tasks, only: [:edit, :update, :destroy]
	

  # index action has been removed


  def new
    @task = Task.new
  end

  def create
    @task  = Task.create(task_params)
  end

def home
end

def update
    @task.update_attributes(task_params)
end

def destroy
    @task.destroy
	redirect_to tasks_path
end

def show
	gon.id = Task.find(params[:id])
end

  private

    def all_tasks
      @tasks = Task.all
    end

    def set_tasks
      @task = Task.find(params[:id])
    end

    def task_params
      params.require(:task).permit(:description, :deadline)
    end

end