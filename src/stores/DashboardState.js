import { observable, action, toJS } from 'mobx';
import { autobind } from 'core-decorators';
import API from '../helpers/api';
import DataState from './DataState';
export default class DashboardState extends DataState {
  @observable isEditMode = false

  @autobind @action setItem(item) {
    const index = this.getItemIndex(item);
    if (index === -1) {
      return;
    }
    this.items = [].concat(
      this.items.slice(0, index),
      item,
      this.items.slice(index + 1)
    );
  }

  @autobind fetchData() {
    this.items.forEach(item => {
      this.setItem({ ...item, loading: true });
      API.post(item.widget.data_url, {
        body: { filter: toJS(item.widget.filter_params) }
      }, []).then(data => {
        this.setItem({ ...item, loading: false, widget: { ...item.widget, data } })
      })
    });
  }

  @autobind @action updatePositions() {
    this.items = this.items.map((item, index) => {
      return { ...item, order_position: index + 1 };
    })
  }

  @autobind @action removeItem(item) {
    this.items = this.items.filter(({ id }) => item.id !== id);
  }

  @autobind @action resizeItem(item) {
    const widget_size = item.widget_size == 1 ? 2 : 1;
    API.put(`${this.dataUrl}/${item.id}`, {
      body: {
        dashboard_widget: {
          widget_size,
        }
      }
    }).then(() => {
      this.setItem({ ...item, widget_size });
    })
  }

  @autobind destroyItem(item) {
    const request = API.delete(`${this.destroyUrl || this.dataUrl}/${item.id}`);
    request.then(({ flash_type }) => {
      this.closeDestroyWarning();
      if (flash_type !== 'success') {
        return;
      }
      if (this.pagination.recordsFiltered === 1) {
        this.setPagination({ page: Math.max(this.pagination.page - 1, 1) })
      }
      this.removeItem(item);
      this.updatePositions();
    });
    return request;
  }

  @autobind @action switchPageMode(isEditMode) {
    this.isEditMode = isEditMode;
  }
}
