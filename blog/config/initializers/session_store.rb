# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :cookie_store,
                                       :key => '_family_interaction_map_session',
                                       :expire_after => 60.minutes

