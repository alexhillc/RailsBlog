class CreateFamilies < ActiveRecord::Migration
  def change
    create_table :families do |t|
      t.belongs_to :user, index: true
      t.string :encrypted_name
      t.datetime :created_at
      t.datetime :updated_at
    end
  end
end
