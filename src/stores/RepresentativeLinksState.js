import { observable, action } from 'mobx';
import { autobind } from 'core-decorators';
import API from '../helpers/api';

export default class RepresentativeLinksState {
  @observable links = [];

  @autobind @action setItems(links) {
    this.links = links;
  }

  @autobind @action appendLink(link) {
    this.links = [...this.links, link];
  }

  @autobind @action addLink({ url }) {
    API.post(this.linksUrl, {
      body: {
        url
      },
    }).then(({ success, ...link }) => {
      if (!!success) {
        this.appendLink({ ...link, url });
      }
    });
  }

  @autobind @action updateLink(link) {
    const index = this.links.findIndex(({ id }) => link.id === id);

    this.links = [].concat(
      this.links.slice(0, index),
      [link],
      this.links.slice(index + 1)
    );
  }

  @autobind @action editLink(link) {
    API.put(`${this.linksUrl}/${link.id}`, {
      body: link,
    }).then(({ success }) => {
      if (!!success) {
        this.updateLink(link);
      }
    });
  }

  @autobind @action removeLink(link) {
    this.links.remove(link);
  }

  @autobind @action destroyLink(link) {
    API.delete(`${this.linksUrl}/${link.id}`).then(() => {
      this.removeLink(link);
    });
  }
};
