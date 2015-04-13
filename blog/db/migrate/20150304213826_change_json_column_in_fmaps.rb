class ChangeJsonColumnInFmaps < ActiveRecord::Migration
  def change
  change_column :fmaps, :json, :text, :limit => 4294967295
  end
end
