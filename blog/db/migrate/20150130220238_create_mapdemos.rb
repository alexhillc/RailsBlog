class CreateMapdemos < ActiveRecord::Migration
  def change
    create_table :mapdemos do |t|
      t.text :json

      t.timestamps
    end
  end
end
