class CreateFmaps < ActiveRecord::Migration
  def change
    create_table :fmaps do |t|
      t.string :title
      t.text :json
      t.string :username
      t.string :family
      t.text :notes
      t.string :extra

      t.timestamps
    end
  end
end
