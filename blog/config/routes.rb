Rails.application.routes.draw do

  get 'accountmanagement/createaccount'

  devise_for :users
  get 'admin/index'

  default_url_options :host => "https://familymap.noip.me"
  

  get 'password_resets/new'

  get 'scenarios/valid_scenarios', :as => 'valid_scenarios'
  get 'fmaps/valid_fmaps', :as => 'valid_fmaps'

  get 'fmaps/options'

  #get 'welcome/index'
	resources :articles
	resources :users
	resources :mapdemo
	resources :posts
	resources :tasks
	resources :fmaps
	resources :password_resets
        resources :families
        resources :scenarios

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'welcome#index'
   
  get "/log-in" => "sessions#new"
  post "/log-in" => "sessions#create"
  get "/log-out" => "sessions#destroy", as: :log_out
	
  get '/about' => 'fmaps#about'

  get 'accountmanagement/' => 'accountmanagement#index'
  get 'accountmanagement/updatepassword'
  post 'accountmanagement/updatepassword' => 'accountmanagement#update'
  get 'accountmanagement/createaccount'
  post 'accountmanagement/createaccount' => 'accountmanagement#create'
  post 'password_resets/:id' => 'password_resets#update'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
