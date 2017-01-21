import React, {PropTypes} from 'react';
import {Table, Icon, Button, Popconfirm} from 'antd';
import Publish from '../CommentsPublish/CommentsPublish';
import styles from './CommentsList.css';
import moment from 'moment';
import Editor from '../Editor/Editor';
const {Column} = Table;

function CommentsList({
    descendants,
    loadingComments,
    loadingPatch,
    user_id,
    dispatch
}) {

    const columnProps = {
        title: 'Comments',
        key: 'descendants',
        render: (text, record) => {
            const {
                content,
                author,
                created_at,
                visible,
                comment_id,
            } = record;


            const editorProps = {
                initialValue: content,
                loading: loadingPatch,
                commit: ({editorContent, onComplete}) => dispatch({
                    type: 'posts/patchComment',
                    payload: {editorContent, comment_id},
                    onComplete
                })
            };

            const popConfirmProps = {
                title: 'Are you sure to delete this comment?',
                okText: 'Yes, sure',
                cancelText: 'Cancel',
                onConfirm() {
                    dispatch({
                        type: 'posts/deleteComment',
                        payload: {comment_id}
                    });
                }
            };

            return (
                <div>
                    <div className={styles.content}>{visible ? content : 'can not see'}</div>
                    <p className={styles.meta}>
                        By <em>{author.username}</em>, {moment(created_at).fromNow()}
                    </p>
                    {
                        user_id === author.user_id ?
                            <Button.Group className={styles.panel}>
                                <Editor {...editorProps}>
                                    <Button size="small" type="ghost" icon="edit">
                                        Edit
                                    </Button>
                                </Editor>
                                <Popconfirm {...popConfirmProps}>
                                    <Button size="small" type="ghost" icon="delete">
                                        Delete
                                    </Button>
                                </Popconfirm>
                            </Button.Group> : null
                    }
                </div>
            );
        }
    };

    return (
        <div>
            <Table
                loading={loadingComments}
                rowKey="comment_id"
                size="small"
                showHeader={false}
                dataSource={descendants}
                title={() => <h2><Icon type="message" className={styles.icon}/>Comments</h2>}
            >
                <Column {...columnProps}/>
            </Table>
            <Publish
                loading={loadingComments}
                commit={({commentInput}) => {
                    dispatch({
                        type: 'posts/createNewComment',
                        payload: {commentInput}
                    });
                }}
            />
        </div>
    );
}

CommentsList.propTypes = {
    descendants: PropTypes.array.isRequired,
    user_id: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default CommentsList;