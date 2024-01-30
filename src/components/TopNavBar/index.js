export default function TopNavBar() {
   return (
    <nav id="top_navbar" class="navbar navbar-default navbar-fixed-top am-top-header">
  <div class="container-fluid">
    <div id="am-navbar-collapse" class="collapse navbar-collapse">

      <div class="navbar_left_part">
          <div class="logo_image"></div>
        <ul class="nav navbar-nav am-nav-right">
            <li class="menu_level1 level1_list1 js_menu_level1 js_level1_list1" >
                <span class="icon s7-diamond"></span>
                <span class="button_text">Admin</span>
            </li>
            <li class="arrow_divider">&nbsp;</li>
            <li class="client_name">
                <div class="two_rows_name">QA</div>
                <div class="two_rows_name">Test Client</div>
                <div class="one_row_name"></div>
            </li>

              <li class="nav_divider">&nbsp;</li>

              <li class="menu_level1 level1_list2 js_menu_level1 js_level1_list2">
                  <span class="icon s7-note2"></span>
                  <span class="button_text">Results</span>

              </li>
    
              <li class="nav_divider">&nbsp;</li>

              <li class="menu_level1 level1_list3 js_menu_level1 js_level1_list3 js_level2_trigger <%= 'l1_selected' if one_of_current_pages?([client_queries_path(@current_cm_client), client_query_templates_path(@current_cm_client)])  %>">
                <a href="#" role="button">
                  <span class="icon s7-menu"></span>
                  <span class="button_text">Queries</span>
                </a>
              </li>

            <li class="nav_divider">&nbsp;</li>
            <li class="menu_level1 level1_list4 js_menu_level1 js_level1_list4 <%= 'l1_selected' if current_page?(case_management_client_incidents_path(@client)) %>">
                <span class="icon s7-attention"></span>
                <span class="button_text">Incidents</span>
            </li>

            <li class="nav_divider">&nbsp;</li>

            <li class="menu_level1 level1_list5 js_menu_level1 js_level1_list5 js_level2_trigger
              <%= 'l1_selected' if one_of_current_pages?([
                  case_management_client_analytics_dashboard_path(@current_cm_client),
                  case_management_client_analytics_incident_user_activities_path(@current_cm_client),
                  case_management_client_analytics_result_user_activities_path(@current_cm_client),
                  case_management_client_analytics_path(@current_cm_client),
                  case_management_client_analytics_fields_path(@current_cm_client),
                  case_management_client_analytics_online_reports_path(@current_cm_client),
                  case_management_client_analytics_widgets_path(@current_cm_client),
                  case_management_client_analytics_sms_path(@current_cm_client),
                  case_management_client_analytics_trainings_path(@current_cm_client),
                  case_management_client_analytics_field_check_analytics_path(@current_cm_client)
                ]) %>">
              <a href="#" role="button" id="Analytics">
                <span class="icon s7-graph"></span>
                <span class="button_text">Analytics</span>
              </a>
            </li>
            <li class="nav_divider">&nbsp;</li>
            <li class="menu_level1 level1_list6 js_menu_level1 js_level1_list6">
                <span class="icon s7-chat"></span>
                <span class="button_text">Forum</span>

            </li>
            <li class="nav_divider">&nbsp;</li>
            <li class="menu_level1 level1_list6 js_menu_level1 js_level1_list6">
                <span class="icon s7-help1"></span>
                <span class="button_text">Help & Support</span>

            </li>
        </ul>
      </div>  

      {/* <div class="navbar_right_part">
        <ul class="nav navbar-nav navbar-right am-icons-nav">

          <% if @current_cm_client %>
            <li class="dropdown">
               <%= content_tag :div,
                id: "nav-notifications",
                data: render(template: 'notifications/nav_index.json.jbuilder') do %>
              <% end %>
            </li>

            <li class="dropdown  <%= 'l1_selected' if one_of_current_pages?([edit_case_management_client_path(@client), case_management_client_path(@client)]) %>">
              <%= link_to(can?(:edit, Client) ? edit_case_management_client_path(@client) : case_management_client_path(@client),
                          id: 'navbar_settings') do %>
                <div class="icon_wrapper">
                  <span class="icon s7-config"></span>
                </div>
              <% end %>
            </li>
          <% end %>

          <% if current_user %>
            <li class="dropdown">
              <a href="#" data-toggle="dropdown" role="button" aria-expanded="true" id="navbar_user" class="dropdown-toggle">
                <div class="icon_wrapper">
                  <span class="icon s7-user"></span>
                  <span class="icon s7-angle-down"></span>
                </div>
              </a>
              <ul role="menu" class="dropdown-menu">
                <li>
                  <% if current_user.belongs_to_fw? %>
                    <%= link_to(edit_admin_member_path(current_user)) do %>
                        <span class="icon s7-user"></span>Profile
                    <% end %>
                  <% else %>
                    <%= link_to(edit_client_user_path(current_user.client_id, current_user)) do %>
                        <span class="icon s7-user"></span>Profile
                    <% end %>
                  <% end %>
                </li>
                <li>
                  <%= link_to(training_video_portal_index_path) do %>
                      <span class="icon s7-video"></span>Training Video Portal
                  <% end %>
                </li>
                <li>
                  <%= link_to(destroy_user_session_path, :method => :delete ) do %>
                      <span class="icon s7-power"></span>Sign Out
                  <% end %>
                </li>
              </ul>
            </li>
          <% end %>
        </ul>
      </div> */}

        {/* <div class="languages_territories_container">
          <% if @user_territories && @user_territories.count > 1 %>
            <div class="territory_choice dropdown">
              <div href="#" data-toggle="dropdown" role="button" aria-expanded="true" id="navbar_territories" class="dropdown-toggle navbar_territories">
                <div class="ellipsis d-ib">
                  <%= @current_territory.present? ? @current_territory.name : 'All territories' %>
                </div>
                <span class="icon s7-angle-down"></span>
              </div>
              <ul role="menu" class="dropdown-menu territories_dropdown">
                <li>
                  <%= link_to("All territories", select_all_client_territories_path) %>
                </li>
                <% @user_territories.each do |user_territory|%>
                  <% next if  user_territory.name == 'Default' %>
                  <li>
                    <%= link_to(user_territory.name, select_client_territory_path(@client, user_territory)) %>
                  </li>
                <% end %>
              </ul>
            </div>
            <div class="nav_divider">&nbsp;</div>
          <% end %>

          <% if @client_languages && @client_languages.count > 1 %>
            <div class="language_choice dropdown">
              <div href="#" data-toggle="dropdown" role="button" aria-expanded="true" id="navbar_languages" class="dropdown-toggle d-f">
                <div class="ellipsis"><%= @current_language.language %></div>
                <span class="icon s7-angle-down"></span>
              </div>
              <ul role="menu" class="dropdown-menu languages_dropdown">
                <% @client_languages.each do |lang|%>
                  <li>
                    <%= link_to(lang.language, select_client_language_path(@client, lang)) %>
                  </li>
                <% end %>
              </ul>
            </div>
            <div class="nav_divider">&nbsp;</div>
          <% end %>
        </div> */}
    </div>
  </div>

  {/* <div id="navbar_second_layer">
    <div class="content_container">
      <% if @current_cm_client %>
        <% if (@user_role != "client_admin" and @user_role != "client_specialist") || eval(@client.features)["query_ability_enabled"] %>
          <div class="menu_level2 level2_list3 js_level2_list3
            <%=
              paths = [
                client_queries_path(@current_cm_client),
                client_super_queries_path(@current_cm_client),
                client_query_templates_path(@current_cm_client),
                client_single_url_queries_path(@current_cm_client),
              ]
              if @query&.id&.present?
                paths << client_query_versions_path(@current_cm_client, @query)
                if @version
                  paths << client_query_version_path(@current_cm_client, @query)
                end
              end
              'l2_list_selected' if one_of_current_pages?(paths)
            %>">
            <ul role="menu">
              <% if can? :index, Query %>
                <li class="menu_level2_element <%= 'l2_selected' if current_page?(client_queries_path(@current_cm_client)) %>">
                  <%= link_to 'Query List', client_queries_path(@current_cm_client) %>
                </li>
              <% end %>
              <% if can? :index, QueryTemplate %>
                <li class="menu_level2_element <%= 'l2_selected' if current_page?(client_query_templates_path(@current_cm_client)) %>">
                  <%= link_to 'Templates', client_query_templates_path(@current_cm_client) %>
                </li>
              <% end %>
              <% if can? :index, SingleUrlQuery %>
                <li class="menu_level2_element <%= 'l2_selected' if current_page?(client_single_url_queries_path(@current_cm_client)) %>">
                  <%= link_to 'Single Site Search', client_single_url_queries_path(@current_cm_client) %>
                </li>
              <% end %>
            </ul>
          </div>
        <% end %>

        <div class="menu_level2 level2_list5 js_level2_list5
          <%= 'l2_list_selected' if one_of_current_pages?(
            [
              case_management_client_analytics_dashboard_path(@current_cm_client),
              case_management_client_analytics_incident_user_activities_path(@current_cm_client),
              case_management_client_analytics_result_user_activities_path(@current_cm_client),
              case_management_client_analytics_path(@current_cm_client),
              case_management_client_analytics_fields_path(@current_cm_client),
              case_management_client_analytics_online_reports_path(@current_cm_client),
              case_management_client_analytics_widgets_path(@current_cm_client),
              case_management_client_analytics_sms_path(@current_cm_client),
              case_management_client_analytics_trainings_path(@current_cm_client),
              case_management_client_analytics_field_check_analytics_path(@current_cm_client)
            ])
          %>">
          <ul role="menu">
            <% if can? :access, DashboardWidget %>
              <li class="menu_level2_element <%= 'l2_selected' if current_page?(case_management_client_analytics_dashboard_path(@current_cm_client)) %>">
                <%= link_to 'Dashboard', case_management_client_analytics_dashboard_path(@current_cm_client) %>
              </li>
            <% end %>
            <li class="menu_level2_element <%= 'l2_selected' if current_page?(case_management_client_analytics_path(@current_cm_client)) %>">
              <%= link_to 'Incident', case_management_client_analytics_path(@current_cm_client) %>
            </li>
            <% if can? :access, IncidentUserActivity %>
              <li class="menu_level2_element <%= 'l2_selected' if current_page?(case_management_client_analytics_incident_user_activities_path(@current_cm_client)) %>">
                <%= link_to 'Incident UA', case_management_client_analytics_incident_user_activities_path(@current_cm_client) %>
              </li>
            <% end %>
            <% if can? :access, ResultUserActivity %>
              <li class="menu_level2_element <%= 'l2_selected' if current_page?(case_management_client_analytics_result_user_activities_path(@current_cm_client)) %>">
                <%= link_to 'Result UA', case_management_client_analytics_result_user_activities_path(@current_cm_client) %>
              </li>
            <% end %>
            <% if can? :index, :field %>
              <li class="menu_level2_element <%= 'l2_selected' if current_page?(case_management_client_analytics_fields_path(@current_cm_client)) %>">
                <%= link_to 'Field', case_management_client_analytics_fields_path(@current_cm_client) %>
              </li>
            <% end %>
            <% if can? :access, OnlineReport %>
              <li class="menu_level2_element <%= 'l2_selected' if current_page?(case_management_client_analytics_online_reports_path(@current_cm_client)) %>">
                <%= link_to 'Online Reports', case_management_client_analytics_online_reports_path(@current_cm_client) %>
              </li>
            <% end %>
            <% if can? :access, Widget %>
              <li class="menu_level2_element <%= 'l2_selected' if current_page?(case_management_client_analytics_widgets_path(@current_cm_client)) %>">
                <%= link_to 'Widgets', case_management_client_analytics_widgets_path(@current_cm_client) %>
              </li>
            <% end %>
            <% if can? :index, CaseManagement::Analytics::SmsController %>
              <li class="menu_level2_element <%= 'l2_selected' if current_page?(case_management_client_analytics_sms_path(@current_cm_client)) %>">
                <%= link_to 'SMS', case_management_client_analytics_sms_path(@current_cm_client) %>
              </li>
            <% end %>
            <% if can? :index, CaseManagement::Analytics::TrainingsController %>
              <li class="menu_level2_element <%= 'l2_selected' if current_page?(case_management_client_analytics_trainings_path(@current_cm_client)) %>">
                <%= link_to 'EthicsPro', case_management_client_analytics_trainings_path(@current_cm_client) %>
              </li>
            <% end %>
            <% if can? :index, CaseManagement::Analytics::FieldCheckAnalyticsController %>
            <li class="menu_level2_element <%= 'l2_selected' if current_page?(case_management_client_analytics_field_check_analytics_path(@current_cm_client)) %>">
              <%= link_to 'FieldCheck', case_management_client_analytics_field_check_analytics_path(@current_cm_client) %>
            </li>
          <% end %>
          </ul>
        </div>
      <% end %>
    </div>
  </div> */}
</nav>

   )
}