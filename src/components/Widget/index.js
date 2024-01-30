import React, { createElement,useRef } from 'react';
import PropTypes from 'prop-types';
import WIDGETS from 'Constants/Widgets';
import Diagrams from 'Components/Diagrams/AllDiagrams';
import IncidentStatusDialog from '../../pages_/analytics/IncidentStatusDialog';

const Widget = ({ ...widget ,incidents_filter_url,incidents_url,filters }) => {
  const { name, data, collapsed, loading, widget_type, size,filter_params } = widget;
 // console.log(incidents_filter_url,filters,"filterurl");
  if (!widget_type) {
    return null;
  }
  const statusDialog = useRef();
  const componentName = WIDGETS[widget_type].componentName;
  const diagram = createElement(Diagrams[componentName], { data, loading, widgetSize: size,statusSelected:(status)=>{statusDialog.current.handleOpen(status)} });

  return (
    <div className="fw-widget">
      <div className="fw-widget__header">
        <div className="fw-widget__name">
          <div className="ellipsis">{name}</div>
        </div>
      </div>
      {!collapsed && (
        <div className="fw-widget__body">
          {diagram}
        </div>
      )}
      <IncidentStatusDialog ref={statusDialog}
        incidents_filter_url={incidents_filter_url}
        incidents_url={incidents_url}
        filterRef={null}
        filter_params={filter_params}
        filters={filters}
        />
    </div>
  );
}

Widget.propTypes = {
  name: PropTypes.string,
  collapsed: PropTypes.bool,
  loading: PropTypes.bool,
  data: PropTypes.any,
  widget_type: PropTypes.string,
  size: PropTypes.number,
};

export default Widget;
