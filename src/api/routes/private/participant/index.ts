import {
  handleGetParticipantByActivity,
  handleGetParticipantStats,
} from '@controllers/admin/participant/read';
import Router from '@koa/router';
import handleCreateParticipant from '@controllers/admin/participant/create';
import validateCreateParticipant from '@validations/admin/participant/create';
import validateUpdateParticipant from '@validations/admin/participant/update';
import handleUpdateParticipant from '@controllers/admin/participant/update';
import validateDeleteParticipant from '@validations/admin/participant/delete';
import handleDeleteParticipant from '@controllers/admin/participant/delete';

const router = new Router({ prefix: '/participant' });

router.get('/', handleGetParticipantStats);
router.get('/:auid', handleGetParticipantByActivity);
router.post('/', validateCreateParticipant, handleCreateParticipant);
router.put('/', validateUpdateParticipant, handleUpdateParticipant);
router.delete('/', validateDeleteParticipant, handleDeleteParticipant);

export default router;
