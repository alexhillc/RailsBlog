class RemoveUsernameFromFmaps < ActiveRecord::Migration
  def change
    remove_column :fmaps, :username, :string
  end
end
