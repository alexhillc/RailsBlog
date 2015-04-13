class Add < ActiveRecord::Migration
  def change
	add_column :fmaps, :version, :string
  end
end
