<?php

namespace AppBundle\Controller;

use AppBundle\Core\CusPaginationResponse;
use AppBundle\ViewModel\UserViewModel;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\User;
use AppBundle\Form\UserType;
use AppBundle\Form\EditUserType;
use Symfony\Component\Form\FormError;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class UserController extends Controller
{
    /**
     * @Route("/user", name="userIndex")
     */
    public function indexAction(Request $request)
    {
        $repository = $this->getDoctrine()
            ->getRepository('AppBundle:User');
        $allUserCount = $repository->countAll();

        return $this->render('account/userIndex.html.twig',
            array('allUserCount' => $allUserCount,
                'roleCount' => $this->getRoleGroupCount()));
    }

    private function getRoleGroupCount(){
        $em = $this->getDoctrine()->getManager();
        $connection = $em->getConnection();
        $statement = $connection->prepare('SELECT name, COUNT(user_id) as count FROM user_role ur LEFT JOIN roles ON ur.role_id = roles.id GROUP BY name');
        $statement->execute();
        $result = $statement->fetchAll();
        return $result;
    }

    /**
     * @Route("/test", name="test")
     */
    public function testAction(Request $request)
    {
        $repository = $this->getDoctrine()
            ->getRepository('AppBundle:User');

        $users = $repository->paggerByRole(1, 10, "ROLE_ADMIN");

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);

        $users = UserViewModel::toViewModels($users);

        $totalPage = floor($repository->countAll()/10);
        if($repository->countAll()%10!=0)
            $totalPage++;

        $pageResult = new CusPaginationResponse(true, $totalPage, $users);

        $result = $serializer->serialize($pageResult, 'json');

        return new JsonResponse($pageResult);
    }

    /**
     * @Route("/alluser/{size}/{page}", name="allUser")
     */
    public function allUserAction(Request $request, $page, $size)
    {
        $repository = $this->getDoctrine()
            ->getRepository('AppBundle:User');

        $role = $request->query->get('role');
        if($role == null)
            $role = "ROLE_USER";

        $users = $repository->paggerByRole($page, $size, $role);

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);

        $users = UserViewModel::toViewModels($users);

        $totalPage = floor($repository->countAll()/$size);
        if($repository->countAll()%$size!=0)
            $totalPage++;

        $pageResult = new CusPaginationResponse(true, $totalPage, $users);

        $result = $serializer->serialize($pageResult, 'json');

        return new JsonResponse($pageResult);
    }

    /**
     * @Route("/user/register", name="registerUser")
     */
    public function registerUser(Request $request){

        $user = new User();
        $form = $this->createForm(UserType::class, $user);

        // 2) handle the submit (will only happen on POST)
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            // 3) Encode the password (you could also do this via Doctrine listener)
            $password = $this->get('security.password_encoder')
                ->encodePassword($user, $user->getPlainPassword());
            $user->setPassword($password);
            $baseRole = $this->getRole("ROLE_USER");
            $user->addRole($baseRole);

            // 4) save the User!
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            // ... do any other work - like sending them an email, etc
            // maybe set a "flash" success message for the user
            $encoders = array(new XmlEncoder(), new JsonEncoder());
            $normalizers = array(new ObjectNormalizer());

            $serializer = new Serializer($normalizers, $encoders);
            $result = $serializer->serialize($user, 'json');
            return $this->redirectToRoute('homepage');
        }

        return $this->render(
            'account/register.html.twig',
            array('form' => $form->createView())
        );
    }

    /**
     * @Route("/user/role_register/{role}", name="registerRoleUser")
     */
    public function registerRoleUser(Request $request, $role){

        $user = new User();
        $form = $this->createForm(UserType::class, $user);

        // 2) handle the submit (will only happen on POST)
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            // 3) Encode the password (you could also do this via Doctrine listener)
            $password = $this->get('security.password_encoder')
                ->encodePassword($user, $user->getPlainPassword());
            $user->setPassword($password);
            $newRole = $this->getRole($role);
            if($newRole == null) {
                $form->addError(new FormError('Add '.$role.' Role User Fail.'));
                return $this->render(
                    'account/register.html.twig',
                    array('form' => $form->createView())
                );
            }
            $user->addRole($newRole);
            if($role != "ROLE_USER") {
                $baseRole = $this->getRole("ROLE_USER");
                $user->addRole($baseRole);
            }

            // 4) save the User!
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            // ... do any other work - like sending them an email, etc
            // maybe set a "flash" success message for the user
            $encoders = array(new XmlEncoder(), new JsonEncoder());
            $normalizers = array(new ObjectNormalizer());

            $serializer = new Serializer($normalizers, $encoders);
            $result = $serializer->serialize($user, 'json');
            return $this->redirectToRoute('homepage');
        }

        return $this->render(
            'account/register.html.twig',
            array('form' => $form->createView())
        );
    }

    private function getRole($roleName){
        $repository = $this->getDoctrine()
            ->getRepository('AppBundle:Role');
        return $repository->findOneByName($roleName);
    }

    /**
     * @Route("/user/update/active", name="updateUserActive")
     */
    public function updateUserActive(Request $request){
        $userId = $request->request->get('id');
        $active = $request->request->get('active');

        $repository = $this->getDoctrine()
            ->getRepository('AppBundle:User');
        $repository->updateActive($userId, $active);

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        $result = $serializer->serialize($repository->find($userId), 'json');
        return new JsonResponse($result);
    }

    /**
     * @Route("/user/delete", name="deleteUser")
     */
    public function deleteUser(Request $request){
        $userId = $request->request->get('id');

        $repository = $this->getDoctrine()
            ->getRepository('AppBundle:User');
        $repository->deleteUser($userId);

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        return new JsonResponse(true);
    }

    /**
     * @Route("/user/edit/{userId}", name="editUser")
     */
    public function editUser(Request $request, $userId){

        $repository = $this->getDoctrine()
            ->getRepository('AppBundle:User');

        $user = $repository->find($userId);
        $user->setPlainPassword("update");
        $form = $this->createForm(EditUserType::class, $user);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->flush();

            // ... do any other work - like sending them an email, etc
            // maybe set a "flash" success message for the user
            $encoders = array(new XmlEncoder(), new JsonEncoder());
            $normalizers = array(new ObjectNormalizer());

            $serializer = new Serializer($normalizers, $encoders);
            $result = $serializer->serialize($user, 'json');
            return $this->redirectToRoute('userIndex');
        }

        return $this->render(
            'account/editUser.html.twig',
            array('form' => $form->createView())
        );
    }
}
