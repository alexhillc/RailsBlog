class AddUserColumnToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :user_name, :string
  end
end
