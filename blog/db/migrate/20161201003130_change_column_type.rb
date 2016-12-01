class ChangeColumnType < ActiveRecord::Migration
  def up
    change_column :scenarios, :description, :text
  end

  def down
    change_column :scenarios, :description, :string
  end
end
