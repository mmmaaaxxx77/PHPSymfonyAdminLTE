<?php

namespace AppBundle\Controller;

use AppBundle\Core\CusPaginationResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

use AppBundle\ViewModel\RoleViewModel;

class RoleController extends Controller
{
    /**
     * @Route("/role", name="roleIndex")
     */
    public function indexAction(Request $request)
    {
        return $this->render('role/index.html.twig');
    }

    /**
     * @Route("/allrole/{size}/{page}", name="allRole")
     */
    public function allRoleAction(Request $request, $page, $size)
    {
        $repository = $this->getDoctrine()
            ->getRepository('AppBundle:Role');

        $roles = $repository->pagger($page, $size);

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);

        $roles = RoleViewModel::toViewModels($roles);

        $totalPage = floor($repository->countAll()/$size);
        if($repository->countAll()%$size!=0)
            $totalPage++;

        $pageResult = new CusPaginationResponse(true, $totalPage, $roles);

        return new JsonResponse($pageResult);
    }
}
