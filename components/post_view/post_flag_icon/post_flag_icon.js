// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import FlagIcon from 'components/svg/flag_icon';
import FlagIconFilled from 'components/svg/flag_icon_filled';
import Constants, {Locations} from 'utils/constants.jsx';
import {t} from 'utils/i18n';

export default class PostFlagIcon extends React.PureComponent {
    static propTypes = {
        location: PropTypes.oneOf([Locations.CENTER, Locations.RHS_ROOT, Locations.RHS_COMMENT, Locations.SEARCH]).isRequired,
        postId: PropTypes.string.isRequired,
        isFlagged: PropTypes.bool.isRequired,
        isEphemeral: PropTypes.bool,
        actions: PropTypes.shape({
            flagPost: PropTypes.func.isRequired,
            unflagPost: PropTypes.func.isRequired,
        }).isRequired,
    };

    static defaultProps = {
        isEphemeral: false,
        location: Locations.CENTER,
    };

    handlePress = async (e) => {
        e.preventDefault();

        const {
            actions,
            isFlagged,
            postId,
        } = this.props;

        if (isFlagged) {
            await actions.unflagPost(postId);
        } else {
            await actions.flagPost(postId);
        }
    }

    render() {
        if (this.props.isEphemeral) {
            return null;
        }

        const isFlagged = this.props.isFlagged;

        const flagVisible = isFlagged ? 'visible' : '';

        let flagIcon;
        if (isFlagged) {
            flagIcon = <FlagIconFilled className='icon'/>;
        } else {
            flagIcon = <FlagIcon className='icon'/>;
        }

        return (
            <OverlayTrigger
                trigger={['hover', 'focus']}
                key={'flagtooltipkey' + flagVisible}
                delayShow={Constants.OVERLAY_TIME_DELAY}
                placement='top'
                overlay={
                    <Tooltip id='flagTooltip'>
                        <FormattedMessage
                            id={isFlagged ? t('flag_post.unflag') : t('flag_post.flag')}
                            defaultMessage={isFlagged ? 'Unflag' : 'Flag for follow up'}
                        />
                    </Tooltip>
                }
            >
                <button
                    id={`${this.props.location}_flagIcon_${this.props.postId}`}
                    className={'style--none flag-icon__container ' + flagVisible}
                    onClick={this.handlePress}
                >
                    {flagIcon}
                </button>
            </OverlayTrigger>
        );
    }
}
