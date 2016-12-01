class ChangeColumnName < ActiveRecord::Migration
  def change
    rename_column :families, :encrypted_name, :name
  end
end
