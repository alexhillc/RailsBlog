# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161203212058) do

  create_table "articles", force: true do |t|
    t.string   "title"
    t.text     "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "user_name"
  end

  create_table "families", force: true do |t|
    t.integer  "user_id"
    t.text     "encrypted_name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "families", ["user_id"], name: "index_families_on_user_id", using: :btree

  create_table "fmaps", force: true do |t|
    t.string   "title"
    t.text     "json",        limit: 2147483647
    t.text     "notes"
    t.string   "extra"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "version"
    t.integer  "scenario_id"
  end

  add_index "fmaps", ["scenario_id"], name: "index_fmaps_on_scenario_id", using: :btree

  create_table "mapdemos", force: true do |t|
    t.text     "json"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "posts", force: true do |t|
    t.string   "title"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "scenarios", force: true do |t|
    t.integer  "family_id"
    t.string   "title"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "scenarios", ["family_id"], name: "index_scenarios_on_family_id", using: :btree

  create_table "tasks", force: true do |t|
    t.string   "description"
    t.datetime "deadline"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "",    null: false
    t.string   "password_hash"
    t.string   "password_salt"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "auth_token"
    t.string   "password_reset_token"
    t.datetime "password_reset_sent_at"
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.boolean  "admin",                  default: false
    t.boolean  "account_frozen",         default: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
