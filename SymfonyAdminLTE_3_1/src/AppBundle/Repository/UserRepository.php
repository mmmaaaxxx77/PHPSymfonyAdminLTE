<?php

namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * UserRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class UserRepository extends EntityRepository
{
    public function pagger($page, $size){
        $query = $this->createQueryBuilder('p')->orderBy('p.createDate', 'DESC')->getQuery();
        $paginator = new Paginator($query);

        $paginator->getQuery()
            ->setFirstResult($size * ($page - 1)) // Offset
            ->setMaxResults($size); // Limit

        return $paginator;
    }

    public function paggerByRole($page, $size, $role){
        $query = $this->createQueryBuilder('p')->
        leftJoin('p.roles', 'r')->
        where('r.name = :role')->
        setParameter('role', $role)->
        orderBy('p.createDate', 'DESC')->
        getQuery();
        $paginator = new Paginator($query);

        $paginator->getQuery()
            ->setFirstResult($size * ($page - 1)) // Offset
            ->setMaxResults($size); // Limit

        return $paginator;
    }

    public function countAll(){
        return $this->createQueryBuilder('p')->select('count(p.id)')->getQuery()->getSingleScalarResult();
    }

    public function updateActive($id, $active){
        $em = $this->getEntityManager();
        $repository = $em->getRepository('AppBundle:User');
        $user = $repository->findOneById($id);
        if(!$user)
            return false;
        $user->setIsActive($active);
        $em->flush();
        return true;
    }

    public function deleteUser($id){
        $em = $this->getEntityManager();
        $repository = $em->getRepository('AppBundle:User');
        $user = $repository->findOneById($id);
        if(!$user)
            return false;
        $em->remove($user);
        $em->flush();
        return true;
    }
}