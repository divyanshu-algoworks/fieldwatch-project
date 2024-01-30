export default function AdminSideMenu() {
    return (
        <div className="side_menu">
        <div className='active'>
          Clients Dashboard
        </div>
       
          <div className='<%= active_tab(non_fw_client_users_admin_clients_users_path)%>'>
           Manage NON-FW Client Users
          </div>
            <div className='<%= active_tab(admin_clients_users_path)%>'>
            Manage Client Users
          </div>
        
          <div className='<%= active_tab(admin_members_path)%>'>
            Manage FieldWatch Users
          </div>
          <div className='<%= active_tab(admin_activity_logs_path)%>'>
            Activity logs
          </div>
          <div className='<%= active_tab(new_admin_video_path)%>'>
            Video Upload
          </div>
          <div className='<%= active_tab(admin_notices_path)%>'>
            Banners
          </div>
          <div className='<%= active_tab(admin_incident_user_activities_path)%>'>
            User Activities
          </div>
          <div className='<%= active_tab(admin_nps_questions_path)%>'>
            NPS Questions
          </div>
          <div className='<%= active_tab(admin_incident_analytics_path)%>'>
            Incident Analytics
          </div>
          <div className='<%= active_tab(admin_search_results_path)%>'>
            Search Results Analytics
          </div>
          <div className='<%= active_tab(admin_super_search_results_path)%>'>
            Super Search Results Analytics
          </div>
          <div className='<%= active_tab(admin_super_query_analytics_path)%>'>
            Super Query Analytics
          </div>
          <div className='<%= active_tab(admin_notification_alerts_path)%>'>
            Alert Settings
          </div>
          <div className='<%= active_tab(admin_field_check_analytics_path)%>'>
            FieldCheck Analytics
          </div>
      
           <div className='<%= active_tab(admin_global_keywords_path)%>'>
            Global Keywords List
          </div>
      
          <div className='<%= active_tab(admin_admin_level_reports_path)%>'>
            FW Admin Level Reports
          </div>                                                                                     
      </div>
    );
}