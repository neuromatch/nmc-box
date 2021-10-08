import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const WidgetBotCrate = ({ serverId, channelId }) => (
  <Helmet>
    <script src='https://cdn.jsdelivr.net/npm/@widgetbot/crate@3' async defer>
      {`
        new Crate({
          server: "${serverId}",
          channel: "${channelId}"
        })
      `}
    </script>
  </Helmet>
)

WidgetBotCrate.propTypes = {
  serverId: PropTypes.string,
  channelId: PropTypes.string,
};

export default WidgetBotCrate;
