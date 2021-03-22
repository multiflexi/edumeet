import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRoomContext } from '../../../../../RoomContext';
import { withStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import magnet from 'magnet-uri';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DescriptionIcon from '@material-ui/icons/Description';

const styles = (theme) =>
	({
		root :
		{
			display              : 'flex',
			alignItems           : 'center',
			justifyContent       : 'space-between',
			width                : '100%',
			padding              : theme.spacing(1),
			boxShadow            : '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
			'&:not(:last-child)' :
			{
				marginBottom : theme.spacing(1)
			}
		},
		participant :
		{
			display    : 'flex',
			alignItems : 'center'
		},

		avatar :
		{
			borderRadius : '50%',
			height       : '2rem'
		},
		text :
		{
			margin  : 0,
			padding : theme.spacing(1)
		},
		fileContent :
		{
			display    : 'flex',
			alignItems : 'center'

		},
		fileInfo :
		{
			display    : 'flex',
			alignItems : 'center',
			padding    : theme.spacing(1)
		},
		button :
		{
			marginRight : 'auto'
		}
	});

const File = (props) =>
{
	const {
		roomClient,
		displayName,
		picture,
		canShareFiles,
		magnetUri,
		time,
		file,
		classes
	} = props;

	return (
		<div className={classes.root}>
			{/* Avatar */}
			<div className={classes.participant}>
				<img alt='Avatar' className={classes.avatar} src={picture} />
				<span>&nbsp;{displayName}</span>
			</div>
			{/* /Avatar */}

			{/* Content */}
			<div className={classes.fileContent}>
				{ file.files &&
				<Fragment>
					{/*
							<Typography className={classes.text}>
								<FormattedMessage
									id='filesharing.finished'
									defaultMessage='File finished downloading'
								/>
							</Typography>
							*/}
					{ file.files.map((sharedFile, i) => (
						<div className={classes.fileInfo} key={i}>
							<DescriptionIcon />
							<Typography className={classes.text}>
								{sharedFile.name}
							</Typography>
							<Button
								variant='contained'
								component='span'
								className={classes.button}
								onClick={() =>
								{
									roomClient.saveFile(sharedFile);
								}}
							>
								<FormattedMessage
									id='filesharing.save'
									defaultMessage='Save'
								/>
							</Button>
						</div>
					))}
				</Fragment>
				}

				{/* Text */}
				<Typography className={classes.text}>
					{/*
						<FormattedMessage
							id='filesharing.sharedFile'
							defaultMessage='{displayName} shared a file'
							values={{
								displayName
							}}
						/>
						*/}
				</Typography>

				{ (!file.active && !file.files) &&
				<div className={classes.fileInfo}>
					<DescriptionIcon />
					<Typography className={classes.text}>
						{ magnet.decode(magnetUri).dn }
					</Typography>
					{ canShareFiles ?
						<Button
							variant='contained'
							component='span'
							className={classes.button}
							onClick={() =>
							{
								roomClient.handleDownload(magnetUri);
							}}
						>
							<FormattedMessage
								id='filesharing.download'
								defaultMessage='Download'
							/>
						</Button>
						:
						<Typography className={classes.text}>
							<FormattedMessage
								id='label.fileSharingUnsupported'
								defaultMessage='File sharing not supported'
							/>
						</Typography>
					}
				</div>
				}
				{/* /Text */}

				{ file.timeout &&
				<Typography className={classes.text}>
					<FormattedMessage
						id='filesharing.missingSeeds'
						defaultMessage={
							`If this process takes a long time, there might not 
									be anyone seeding this torrent. Try asking someone to 
									reupload the file that you want.`
						}
					/>
				</Typography>
				}

				{ file.active &&
				<progress value={file.progress} />
				}
			</div>
			{/* /Content */}
		</div>
	);
};

File.propTypes = {
	roomClient    : PropTypes.object.isRequired,
	magnetUri     : PropTypes.string.isRequired,
	time          : PropTypes.string.isRequired,
	displayName   : PropTypes.string.isRequired,
	picture       : PropTypes.string,
	canShareFiles : PropTypes.bool.isRequired,
	file          : PropTypes.object.isRequired,
	classes       : PropTypes.object.isRequired
};

const mapStateToProps = (state, { time, magnetUri }) =>
{
	return {
		file          : state.files.filter((item) => item.time === time)[0],
		canShareFiles : state.me.canShareFiles
	};
};

export default withRoomContext(connect(
	mapStateToProps,
	null,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.files === next.files &&
				prev.me.canShareFiles === next.me.canShareFiles
			);
		}
	}
)(withStyles(styles)(File)));