class RemoveFamilyFromFmaps < ActiveRecord::Migration
  def change
    remove_column :fmaps, :family, :string
  end
end
